export const hashCode = (s: string) => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0);

/**
 * list-dict类型的去重
 * @param arr
 * @param key 去重的key
 */
export const dictUnique = (arr: any[], key: string): any[] => {
    let ret: any = {}
    let result = []
    arr.forEach(elem => {
        ret[elem[key]] = elem
    })
    for (let retKey in ret) {
        if (ret.hasOwnProperty(retKey))
            result.push(ret[retKey])
    }
    return result
}

/**
 * 边的去重(一般性列表去重)
 * @param arr
 */
export const edgesUnique = (arr: any[]) => {
    return Array.from(new Set(arr))
}

/**
 * 数组相减的方法 - 使用es新特性
 * @param {Array} a
 * @param {Array} b
 */
export const arrSubtraction = (a: string[], b: string[]) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.filter(i => !b.includes(i))
    }
    throw new Error('arrSubtraction(): Wrong Param Type')
}