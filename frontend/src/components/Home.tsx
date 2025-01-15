import { useEffect, useState } from "react"
import User from "../types/User"
import { getNodes } from "../services/nodes"

interface HomeProps {
    user: User
}

interface NodeInfo {
    nodeId: string,
    value: number,
    timestamp: string
}

const Home = (props: React.PropsWithoutRef<HomeProps>) => {

    const [nodeInfos, setNodeInfos] = useState<NodeInfo[]|null>(null)

    useEffect(() => {
        const effect = async () => {
            const infos = await getNodes()
            setNodeInfos(infos)
        }
        effect()
    }, [])

    return(
        <>
            {props.user.name}
            {nodeInfos ? nodeInfos.map(nodeInfo => {
                return (
                <div>
                    <p>{nodeInfo.nodeId}</p>
                    <p>{nodeInfo.value}</p>
                </div>
            )
            }) : <></>}
        </>
    )
}

export default Home