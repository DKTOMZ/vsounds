import React from "react";
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from "@coreui/react";
import { Link } from "react-router-dom";

export const UseDropdown = ({child1, child2, child3, child4}) => {
    return <CDropdown dark id="my-dropdown">
            <CDropdownToggle color="dark" className="dropdown-icon"><i className="fa-solid fa-user fa-lg"></i></CDropdownToggle>
                <CDropdownMenu className="dropdown-menu">
                    <CDropdownItem className="dropdown-item-disable">{child1.text}</CDropdownItem>
                    <CDropdownItem className="dropdown-item" component={Link} to={child2.route}>{child2.text}</CDropdownItem>
                    <CDropdownItem className="dropdown-item" component={Link} to={child3.route}>{child3.text}</CDropdownItem>
                    <CDropdownItem className="dropdown-item" component="button" onClick={()=>child4.route()}>{child4.text}</CDropdownItem>
                </CDropdownMenu>
        </CDropdown>
};