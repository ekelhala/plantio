import { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css';
import './PlantViewer.css'
import { IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface PlantViewerProps {
    moistureLevelData: {
        nodeId: string,
        value: number,
        timestamp: string
    },
    updateMoistureLevelData: Function
}

const PlantViewer = (props: React.PropsWithoutRef<PlantViewerProps>) => {

    const [updateData, setUpdateData] = useState(false)

    useEffect(() => {
        const effect = async () => {
            await props.updateMoistureLevelData()
        }
        effect()
    }, [updateData])

    return(
        <>
            <div className='viewer-header'>
                <IconButton onClick={() => setUpdateData(!updateData)}
                    className='refresh-button'>
                    <Refresh/>
                </IconButton>
            </div>
            <div className='viewer-container'>
                <div>
                    Node ID: {props.moistureLevelData.nodeId}
                </div>            
                <div className='progress-container'>
                    <p className='secondary-text'>
                        Latest moisture level
                    </p>
                    <CircularProgressbar 
                        value={props.moistureLevelData.value}
                        text={`${props.moistureLevelData.value}%`}
                        strokeWidth={2}
                        styles={buildStyles({
                            textColor: '#4ac769',
                            pathColor: '#4ac769'
                        })}/>
                    <p className='secondary-text'>
                        {new Date(props.moistureLevelData.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        </>
    )
}

export default PlantViewer