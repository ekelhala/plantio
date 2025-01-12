import { useEffect, useState } from "react"

interface PlantViewerProps {
    moistureLevelData: {
        nodeId: string,
        value: number,
        timestamp: Date
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
        Node ID: {props.moistureLevelData.nodeId}
        <br/>
        Latest moisture level: {props.moistureLevelData.value}%
        <br/>
        <button onClick={() => setUpdateData(!updateData)}>Update</button>
        </>
    )
}

export default PlantViewer