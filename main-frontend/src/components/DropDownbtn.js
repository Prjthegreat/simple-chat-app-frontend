import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import dots from '../svg/more.png'
const DropDownbtn = ({dropdownOpen,toggle,index,dropdownIndex,currroomid,user,userid,adminid,socket,isblacklisted}) => {
  const white_blacklisthandler=async()=>{
   //console.log(user,userid,adminid,currroomid)
   //console.log(`${isblacklisted ?'white-list': `black-list`}`)
   
   socket.emit(`${isblacklisted ?'white-list': `black-list`}`,adminid,userid,user,currroomid)
  }
    return (
        <div>
             <Dropdown isOpen={ dropdownIndex===index && dropdownOpen} size="sm" toggle={toggle}>
            <DropdownToggle style={{backgroundColor:'transparent',borderRadius:'5px',border:'none'}}  >
                <img style={{borderRadius:'10px'}} src={dots} color="#5F3616" height="15px" width="15px" />
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={white_blacklisthandler} >{`${isblacklisted ?'WhiteList' : 'Blacklist' }`}</DropdownItem>
            </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default DropDownbtn
