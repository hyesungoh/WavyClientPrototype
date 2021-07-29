import { useRef, useState, useEffect } from "react";
import styled, { CSSProperties } from "styled-components";
import Webcam from "react-webcam";

// import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";

import useCoaching from "Hooks/useCoaching";
import { drawKeypoints, drawSkeleton } from "Utils/draw";
import Handler from "Components/Learning/Handler";
import Video from "Components/Learning/Video";
import Score from "Components/Learning/Score";

interface IDrawResult {
    pose: posenet.Pose;
    videoWidth: number;
    videoHeight: number;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const WebcamWithPosenet = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // for posenet model
    const [detectTime, setDetectTime] = useState<number>(60);
    const [posenetArchitecture, setPosenetArchitecture] = useState<
        "ResNet50" | "MobileNetV1"
    >("MobileNetV1");
    const [outputStride, setOutputStride] = useState<32 | 16 | 8>(16);
    const [keypointConfidence, setKeypointConfidence] = useState<number>(0.5);
    const [skeletonConfidence, setSkeletonConfidence] = useState<number>(0.5);
    const [resolution, setResolution] = useState<{
        width: number;
        height: number;
    }>({ width: 500, height: 500 });

    // for reference video
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [playbackRate, setPlaybackRate] = useState<number>(1);

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef(null);

    const { stackingPose, isStartCompare, setIsStartCompare } = useCoaching();

    const WebcamStyle: CSSProperties = {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        objectFit: "cover",
    };

    const drawResult = ({
        pose,
        videoWidth,
        videoHeight,
        canvasRef,
    }: IDrawResult) => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        drawKeypoints({
            keypoints: pose["keypoints"],
            minConfidence: keypointConfidence,
            ctx,
        });
        drawSkeleton({
            keypoints: pose["keypoints"],
            minConfidence: skeletonConfidence,
            ctx,
        });
    };

    const detectWebcamFeed = async (posenetModel: posenet.PoseNet) => {
        if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video?.videoWidth;
            const videoHeight = webcamRef.current.video?.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            const pose = await posenetModel.estimateSinglePose(video);

            stackingPose(pose);
            drawResult({ pose, videoWidth, videoHeight, canvasRef });
        }
    };

    const runPosenet = async () => {
        setIsLoading(true);
        const posenetModel = await posenet.load({
            inputResolution: {
                width: resolution.width,
                height: resolution.height,
            },
            architecture: posenetArchitecture,
            outputStride: outputStride,
        });
        setIsLoading(false);

        const interval = setInterval(() => {
            detectWebcamFeed(posenetModel);
        }, detectTime);

        return interval;
    };

    useEffect(() => {
        const interval = runPosenet();

        return () => {
            interval.then((t) => {
                clearInterval(t);
            });
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posenetArchitecture, outputStride, detectTime, isStartCompare]);

    if (isLoading) return <div>LOADING ... </div>;

    return (
        <Wrapper>
            <WebcamWrapper>
                <Video
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    playbackRate={playbackRate}
                    setPlaybackRate={setPlaybackRate}
                    isStartCompare={isStartCompare}
                />
            </WebcamWrapper>

            <WebcamWrapper>
                <Webcam ref={webcamRef} style={WebcamStyle} />
                <canvas ref={canvasRef} style={WebcamStyle} />
            </WebcamWrapper>

            <Handler
                detectTime={detectTime}
                setDetectTime={setDetectTime}
                posenetArchitecture={posenetArchitecture}
                setPosenetArchitecture={setPosenetArchitecture}
                outputStride={outputStride}
                setOutputStride={setOutputStride}
                resolution={resolution}
                setResolution={setResolution}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playbackRate={playbackRate}
                setPlaybackRate={setPlaybackRate}
                keypointConfidence={keypointConfidence}
                setKeyPointConfidence={setKeypointConfidence}
                skeletonConfidence={skeletonConfidence}
                setSkeletonConfidence={setSkeletonConfidence}
                isStartCompare={isStartCompare}
                setIsStartCompare={setIsStartCompare}
            />

            <Score />
        </Wrapper>
    );
};

export default WebcamWithPosenet;

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
`;

const WebcamWrapper = styled.div`
    position: relative;
    width: 500px;
    height: 100vh;

    overflow: hidden;
`;