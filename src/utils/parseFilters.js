const parseBoolean = (unknown, defaultValue) => {
    if (!['true', 'false'].includes(unknown))
        return defaultValue;
    return unknown === 'true' ? true : false;
    
};

const parseString = (unknown, defaultValue) => {
    if (['personal', 'home'].includes(unknown))
        return unknown;

    return defaultValue;
};
export const parseFilters = (query) => {

    return {
        isFavourite: parseBoolean(query.isFavourite, false),
        contactType: parseString(query.contactType, ''), 
    };
 };