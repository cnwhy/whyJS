/**
 * 前端简单日志策略
 */

if (!console.setMustLog) {
    const { log, info, warn } = console;
    const debugkey = "debug";
    const expDebug = new RegExp(`[\?&]${debugkey}=([^&]*)`);
    const debugFormt = arg => (arg === "true" ? true : arg?.split ? arg.split(",") : arg);
    const hitMark = mark => {
        let debug = logMark;
        if (Array.isArray(debug)) {
            debug = debug.includes(mark);
        }
        return debug === true || debug === mark;
    };
    const emptFn = () => { };
    //要控制的日志方法
    const commEvents = [
        "log",
        "info"
        // "warn",
        // "table",
        // "error"
    ];
    const attrObj = {};
    let queryDebug = debugFormt(location?.search.match(expDebug)?.[1]);
    let locaDebug = debugFormt(localStorage.getItem(debugkey));
    let logMark = queryDebug ?? locaDebug ?? process?.env?.NODE_ENV === "development";
    console.log('[log]')
    logMark !== true && info.call(console, `普通日志已屏蔽，如需查看日志，请执行 console.setMustLog() 启用`);
    commEvents.map(v => {
        let fn = console?.[v] ?? emptFn;
        let rfn = function (...arg) {
            logMark === true && fn.call(console, ...arg);
        };
        attrObj[v] = {
            get() {
                return logMark === true ? fn : emptFn;
                // return rfn;
            }
        };
    });
    // 重写console的属性 实现日志控制
    Object.defineProperties(console, attrObj);

    console.setMustLog = function mustLog(arg = true) {
        localStorage.setItem(debugkey, arg);
        logMark = debugFormt(arg);
        location.reload();
    };
    /**
     * 关键日志 必定打印的日志
     */
    console.mustLog = log;
    /**
     * 创建一个可单独控制 打印日志的方法, __debug__ = <mark> 时会打印日志
     * @param {*} mark
     * @returns
     */
    console.createLog = function createLog(mark) {
        mark += "";
        // if(!hitMark(mark)) info.call(console,`普通日志已屏蔽，如需查看日志，请执行 console.setMustLog(${JSON.stringify(mark)}) `)
        return hitMark(mark) ? log : emptFn;
    };
}

export const createLog = console.createLog;
export const mustLog = console.mustLog;