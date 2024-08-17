import React, { ReactNode } from 'react'
import { Tooltip } from '@chakra-ui/react'
import { ImTree } from 'react-icons/im'
import { IconType } from 'react-icons';

type SquareTooltipButtonProps = {
    label: string;
    toolTipBg: string;
    toolTipTextColor: string;
    onClickFunction: () => void;
    buttonBg: string;
    buttonTextColor: string;
    Icon: IconType;
}


const SquareTooltipButton = ({label, toolTipBg, toolTipTextColor, onClickFunction, buttonBg, buttonTextColor, Icon} : SquareTooltipButtonProps) => {
  return (
    <Tooltip label={label} bg={toolTipBg} textColor={toolTipTextColor}>
        <p
            onClick={onClickFunction}
            className={`hover:cursor-pointer p-2 rounded-md bg-[${buttonBg}] text-[${buttonTextColor}] border-2 border-[${buttonTextColor}]`}
        >
            <Icon />
        </p>
    </Tooltip>
  )
}

export default SquareTooltipButton