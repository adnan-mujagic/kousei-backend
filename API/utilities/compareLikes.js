function compare(a, b){
    if(a.likes.length>b.likes.length){
        return -1;
    }else if(a.likes.length==b.likes.length){
        return 0;
    }
    return 1;
}

module.exports = compare;