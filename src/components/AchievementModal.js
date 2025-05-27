export function AchievementModal({ achievement, onClose }) {
    if (!achievement) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Congratulations!</h2>
                <p>You earned achievement: <strong>{achievement.name}</strong></p>
                <p>{achievement.description}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
