const checkDate = (date) => {
    
  const dateArr = date.split('-')
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  if (Number(dateArr[0]) < year || Number(dateArr[1]) < month || Number(dateArr[2]) < day) {
    return false;
  }else {
    return true
  }
}


module.exports = checkDate