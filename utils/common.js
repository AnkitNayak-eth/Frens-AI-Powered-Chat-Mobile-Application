export const getRoomId = (userId1,userId2)=>{
    const sortedId = [userId1,userId2].sort();
    const roomId = sortedId.join('-');
    return roomId;
}

export const formatDate = date =>{
    var day = date.getDate();
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var month = monthNames[date.getMonth()];
    var formattedDate = day + ' ' + month;
    return formattedDate;
}