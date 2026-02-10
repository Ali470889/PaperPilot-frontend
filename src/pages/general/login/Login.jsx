import { useRef, useEffect } from 'react';
import { LoginForm } from '../../../components/login-form'
import { InteractiveBubbleBackground } from '../../../components/shared/BubbleBackground'

import loginSound from '/sounds/loginSound.mp3'

const Login = () => {
    const audioRef = useRef(null);

    const playAudio = () => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = 0;
        audioRef.current.play();
    };

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex  justify-center gap-2 md:justify-start">
                    <div
                        onClick={playAudio}
                        className="flex  items-center cursor-pointer gap-2 font-medium"
                    >
                        <div className=" border p-1 flex size-10 items-center justify-center rounded-md ">
                            <img
                                src="/logo.svg"
                                alt="Image"
                                className=" h-4 "
                            />
                        </div>
                        Mentr
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted  hidden justify-center items-center lg:flex">
              
                <img
                    src="/logo.svg"
                    alt="Image"
                    className=" h-20 "
                />
            </div>

            <InteractiveBubbleBackground
                speed={0.5}
                quantity={1}
                maxBubbles={5}
            />
            {/* <button onClick={playAudio}>Play Sound</button> */}
            <audio ref={audioRef}>
                <source src={loginSound} type="audio/mpeg" />
            </audio>
        </div>
    )
}

export default Login
