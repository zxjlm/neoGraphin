export const hashCode = (s: string) => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0);


export const dictUnique = (arr: [], pk:string) => {
    let ret = {}
    let result = []
    arr.forEach(elem => {ret[elem[pk]] = elem})
    for (let retKey in ret) {
        // @ts-ignore
        result.push(ret[retKey])
    }
    return result
}

export const edgesUnique = (arr: []) => {
    return Array.from(new Set(arr))
}

