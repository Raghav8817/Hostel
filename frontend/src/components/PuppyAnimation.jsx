import '../styles/PuppyAnimation.css'
const PuppyAnimation = () => {
    return (
        <div className="puppy-wrapper">
            <div className="puppy-container">
                {/* Floating Z's for Sleeping State */}
                <div className="z-inputs">
                    <div className="z z-1">Z</div>
                    <div className="z z-2">Z</div>
                    <div className="z z-3">Z</div>
                </div>

                <div className="puppy">
                    {/* Ears */}
                    <div className="ear ear-l"></div>
                    <div className="ear ear-r"></div>

                    {/* Face */}
                    <div className="face">
                        <div className="eye eye-l">
                            <div className="pupil"></div>
                        </div>
                        <div className="eye eye-r">
                            <div className="pupil"></div>
                        </div>
                        <div className="nose"></div>
                        <div className="mouth"></div>
                    </div>

                    {/* Body & Legs */}
                    <div className="puppy-body">
                        <div className="paw paw-l"></div>
                        <div className="paw paw-r"></div>
                    </div>

                    {/* Tail */}
                    <div className="tail"></div>
                </div>
            </div>
            <p className="loading-text">Waking up the server...</p>
        </div>
    );
};

export default PuppyAnimation;