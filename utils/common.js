export const getRoomId = (userId1,userId2)=>{
    const sortedId = [userId1,userId2].sort();
    const roomId = sortedId.join('-');
    return roomId;
}