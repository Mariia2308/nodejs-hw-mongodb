const parceNumber = (unknown, defaultValue) => {
    if ( typeof unknown !== 'string') 
        return defaultValue;
    
    const parsedNumber = parseInt(unknown);
    if (Number.isNaN(parsedNumber))
        return defaultValue;

    return parsedNumber;
    
};
export const parsePaginationParams = (query) => {
    const { page, perPage } = query;
    return {
        
        page: parceNumber(page, 1),
        perPage: parceNumber(perPage, 5),
    
    };
};
