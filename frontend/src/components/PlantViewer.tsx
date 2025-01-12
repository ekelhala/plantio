
interface PlantViewerProps {
    moistureLevelData: {
        nodeId: string,
        value: number,
        timestamp: Date
    }
}

const PlantViewer = (props: React.PropsWithoutRef<PlantViewerProps>) => {
    return(
        <>
        Node ID: {props.moistureLevelData.nodeId}
        <br/>
        Latest moisture level: {props.moistureLevelData.value}%
        </>
    )
}

export default PlantViewer