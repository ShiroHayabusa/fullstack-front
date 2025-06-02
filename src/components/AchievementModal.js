import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const AchievementModal = ({ achievement, onClose }) => {
    const [show, setShow] = React.useState(true);

    useEffect(() => {
        setShow(!!achievement);
    }, [achievement]);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    if (!achievement || achievement.length === 0) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>🎉 Congratulations!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {achievement.map((a, index) => (
                    <div key={index} className="mb-3">
                        <h5>{a.description}</h5>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AchievementModal;
