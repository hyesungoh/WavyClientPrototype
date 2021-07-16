import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

interface IHandler {
    detectTime: number;
    setDetectTime: Dispatch<SetStateAction<number>>;

    posenetArchitecture: "ResNet50" | "MobileNetV1";
    setPosenetArchitecture: Dispatch<
        SetStateAction<"ResNet50" | "MobileNetV1">
    >;

    outputStride: 32 | 16 | 8;
    setOutputStride: Dispatch<SetStateAction<32 | 16 | 8>>;

    resolution: { width: number; height: number };
    setResolution: Dispatch<SetStateAction<{ width: number; height: number }>>;
}

const Handler = ({
    detectTime,
    setDetectTime,
    posenetArchitecture,
    setPosenetArchitecture,
    outputStride,
    setOutputStride,
    resolution,
    setResolution,
}: IHandler) => {
    const onDetectTimeClick = (e: React.MouseEvent<HTMLOptionElement>) => {
        const { value } = e.target as HTMLOptionElement;
        setDetectTime(parseInt(value));
    };

    const onWidthClick = (e: React.MouseEvent<HTMLOptionElement>) => {
        const { value } = e.target as HTMLOptionElement;
        setResolution({ ...resolution, width: parseInt(value) });
    };

    const onHeightClick = (e: React.MouseEvent<HTMLOptionElement>) => {
        const { value } = e.target as HTMLOptionElement;
        setResolution({ ...resolution, height: parseInt(value) });
    };

    const onOutputStrideClick = (e: React.MouseEvent<HTMLOptionElement>) => {
        const { value } = e.target as HTMLOptionElement;
        const numValue = parseInt(value);

        if (numValue === (8 || 16 || 32)) {
            setOutputStride(numValue);
        }
    };

    return (
        <Wrapper>
            <SelectWrapper>
                <span>posenet model </span>
                <select defaultValue={posenetArchitecture}>
                    <option
                        onClick={() => {
                            setPosenetArchitecture("MobileNetV1");
                        }}
                    >
                        MobileNetV1
                    </option>
                    <option
                        onClick={() => {
                            setPosenetArchitecture("ResNet50");
                        }}
                    >
                        ResNet50
                    </option>
                </select>
            </SelectWrapper>

            <SelectWrapper>
                <span>Detect Time </span>
                <select defaultValue={detectTime}>
                    <option onClick={onDetectTimeClick}>33</option>
                    <option onClick={onDetectTimeClick}>50</option>
                    <option onClick={onDetectTimeClick}>100</option>
                    <option onClick={onDetectTimeClick}>200</option>
                    <option onClick={onDetectTimeClick}>300</option>
                    <option onClick={onDetectTimeClick}>490</option>
                </select>
            </SelectWrapper>

            <SelectWrapper>
                <span>resolution - width </span>
                <select defaultValue={resolution.width}>
                    <option onClick={onWidthClick}>200</option>
                    <option onClick={onWidthClick}>300</option>
                    <option onClick={onWidthClick}>400</option>
                    <option onClick={onWidthClick}>500</option>
                    <option onClick={onWidthClick}>700</option>
                    <option onClick={onWidthClick}>900</option>
                </select>
            </SelectWrapper>

            <SelectWrapper>
                <span>resolution - height </span>
                <select defaultValue={resolution.height}>
                    <option onClick={onHeightClick}>200</option>
                    <option onClick={onHeightClick}>300</option>
                    <option onClick={onHeightClick}>400</option>
                    <option onClick={onHeightClick}>500</option>
                    <option onClick={onHeightClick}>700</option>
                    <option onClick={onHeightClick}>900</option>
                </select>
            </SelectWrapper>

            <SelectWrapper>
                <span>Output Stride </span>
                <select defaultValue={outputStride}>
                    <option onClick={onOutputStrideClick}>8</option>
                    <option onClick={onOutputStrideClick}>16</option>
                    <option onClick={onOutputStrideClick}>32</option>
                </select>
            </SelectWrapper>
        </Wrapper>
    );
};

export default Handler;

const Wrapper = styled.section`
    position: absolute;
    top: 0;
    right: 12px;

    padding: 10px 14px;
    background-color: #dce2f0;
`;

const SelectWrapper = styled.div`
    color: #50586c;
`;
