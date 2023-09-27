import { CToast, CToastHeader, CToastBody } from "@coreui/react";

export const UseToast = (props) => {
    return <CToast className="toast" color="danger" animation={false} autohide={false} visible={true}>
            <CToastHeader closeButton>
                <svg
                    className="rounded me-2"
                    width="20"
                    height="20"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                    role="img"
                >
                    <rect width="100%" height="100%" fill="rgb(148, 22, 22)"></rect>
                </svg>
                <div className="fw-bold me-auto">Error</div>
            </CToastHeader>
            <CToastBody>{props.message}</CToastBody>
        </CToast>
};