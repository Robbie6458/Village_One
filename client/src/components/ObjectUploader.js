import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import { Button } from "@/components/ui/button";
/**
 * A file upload component that renders as a button and provides a modal interface for
 * file management.
 */
export function ObjectUploader({ maxNumberOfFiles = 1, maxFileSize = 10485760, // 10MB default
onGetUploadParameters, onComplete, buttonClassName, children, }) {
    const [showModal, setShowModal] = useState(false);
    const [uppy] = useState(() => new Uppy({
        restrictions: {
            maxNumberOfFiles,
            maxFileSize,
        },
        autoProceed: false,
    })
        .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
    })
        .on("complete", (result) => {
        onComplete?.(result);
    }));
    return (_jsxs("div", { children: [_jsx(Button, { onClick: () => setShowModal(true), className: buttonClassName, children: children }), _jsx(DashboardModal, { uppy: uppy, open: showModal, onRequestClose: () => setShowModal(false), proudlyDisplayPoweredByUppy: false })] }));
}
