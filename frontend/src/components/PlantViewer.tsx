import { useEffect, useState } from "react"
import { CircularProgressbar } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css';
import './PlantViewer.css'

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
                                strokeWidth={2}/>
                <p className='secondary-text'>
                    Updated: {new Date(props.moistureLevelData.timestamp).toLocaleString()}
                </p>
            </div>
            <div>
                <button onClick={() => setUpdateData(!updateData)}>Update</button>
            </div>
        </div>
    )
}

export default PlantViewer