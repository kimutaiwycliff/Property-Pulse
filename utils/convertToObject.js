export const convertToSerializableObject = (leanObject) => {
    for (const key of Object.keys(leanObject)) {
        if (leanObject[key].toJSON && leanObject[key].toString) {
            leanObject[key] = leanObject[key].toString();
        }
    }
    return leanObject;
};