function comparePopularity(a, b){
    const quotient_a = calculatePopularityQuotient(a);
    const quotient_b = calculatePopularityQuotient(b);
    if(quotient_a>quotient_b){
        return -1;
    }else if(quotient_a==quotient_b){
        return 0;
    }
    return 1;
}

function calculatePopularityQuotient(post){
    return post.likes.length / (Date.now() - post.created_at);
}

module.exports = comparePopularity;