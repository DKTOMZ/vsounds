import React, { useState } from "react";
import '@coreui/coreui/dist/css/coreui.min.css';
import { CModal,CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";

export const UseModal = (props) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const styles = {
        '--cui-modal-bg': '#2c3640',
        '--cui-modal-color': 'white'
    };
    return <CModal style={styles} size="sm" backdrop="static" alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader closeButton={false}>
        <CModalTitle>{props.title}</CModalTitle>
      </CModalHeader>
        <CModalBody>{props.body}</CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={() => {
            setVisible(false);
            document.documentElement.scrollTo({top: 0, left: 0, behavior: 'instant'});
            navigate(props.route);
            }}>{props.buttonText}</CButton>
      </CModalFooter>
    </CModal>
};