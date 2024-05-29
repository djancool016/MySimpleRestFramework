/**
 * 
 * @param {String} oldKey 
 * @param {String} newKey 
 * @param {Object} obj 
 * @returns 
 */
function changeObjKey(oldKey, newKey, obj){
    const newObj = {...obj}
    newObj[newKey] = newObj[oldKey]
    delete newObj[oldKey]
    return newObj
}

module.exports = {changeObjKey}