import {Notification} from '../models/Notification';
import {User} from '../models/User';
import {Node} from '../models/Node'
import { send } from './sendEmail';
import { Email } from '../types/Email';
import { MoistureMessage } from '../types/MoistureMessage';

export const processMoistureMessage = async (msg: MoistureMessage) => {
  const { nodeId, value } = msg

  // Find all notifications for this node
  const notifications = await Notification.find({ nodeId })
  try {
    for (const notification of notifications) {
      const node = await Node.findOne({nodeId: notification.nodeId})
      // calculate current moisture percentage with node's settings
      const percentage = ((value - node.dryValue)/(node.wetValue - node.dryValue))*100
      if (percentage < notification.percentage) {

        const user = await User.findById(notification.userId);
        // Get user's options for the node (only nickname as of now)
        const nodeOptions = user.nodes.find(node => node.nodeId===nodeId)

        if (user && user.email) {
          const email: Email = {
              sender: {email: 'notifications@multameter.com', name: 'MultaMeter Notifications'},
              to: [{email: user.email}],
              subject: 'Uusi ilmoitus',
              htmlContent: `
                  <html>
                      <h3>${nodeOptions.name} tarvitsee vettä</h3>
                      <p>Kasvin <b>${nodeOptions.name}</b> kosteustaso on alle ${notification.percentage}%</p>
                  </html>
              `
          }
          await send(email);
          await Notification.findByIdAndDelete(notification.id)
        }
      }
  }
  }
  catch(error){
    console.log(error)
  }
};