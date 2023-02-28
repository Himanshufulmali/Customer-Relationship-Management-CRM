exports.mapData = (data) => {
return{
    mongoId : data.id, 
    userId : data.userId,
    name : data.name,
    email : data.email, 
    userType : data.userType,
    userStatus : data.userStatus,
    createdAt : data.createdAt,
    updatedAt : data.updatedAt
}
}