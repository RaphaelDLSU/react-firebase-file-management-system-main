
// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import DogPicture from "./components/DogPicture";
import FunctionSelector from "./components/FunctionSelector";
import ProjectSelector from "./components/ProjectSelector";
import TaskCreator from "./components/TaskCreator";
import TaskRequirement from "./components/TaskRequirement";
import RequestManagementLink from "./components/Link/RequestManagementLink";
import RFICreator from "./components/RFICreator";
import RFIImages from "./components/RFIImages";


const botName = "FileWhiz";

const config = {
  initialMessages: [
    createChatBotMessage(`Hello my name is ${botName} `),
    createChatBotMessage(
      'First things first, what do you want to do? (Type "Help" for more information) ',
      {
        widget: "functionSelector",
        delay: 500,
      }
  ),],
  state: {
    project :'',
    func:'',
    taskName:'',
    taskRequirement:[],
    rfiDesc:'',
    rfiImages:[],

  },
  widgets:[
    {
      widgetName:'dogPicture',
      widgetFunc:(props)=> <DogPicture {...props}/>,
    },
    {
      widgetName:'functionSelector',
      widgetFunc:(props)=> <FunctionSelector {...props}/>,
      mapStateToProps: ["func"],
    },
    {
      widgetName:'projectSelector',
      widgetFunc:(props)=> <ProjectSelector {...props}/>,
      mapStateToProps: ["project",'func'],
    },
    {
      widgetName:'taskCreator',
      widgetFunc:(props)=> <TaskCreator {...props}/>,
      mapStateToProps: ["taskName"],
    },
    {
      widgetName:'taskRequirement',
      widgetFunc:(props)=> <TaskRequirement {...props}/>,
      mapStateToProps: ["taskName",'project'],
    },
    {
      widgetName: "requestManagementLink",
      widgetFunc: (props) => <RequestManagementLink {...props} />,
    },
    {
      widgetName: "rfiCreator",
      widgetFunc: (props) => <RFICreator {...props} />,
      mapStateToProps: ["rfiDesc"],
    },
    {
      widgetName: "rfiImages",
      widgetFunc: (props) => <RFIImages {...props} />,
      mapStateToProps: ["rfiDesc",'rfiImages','project'],
    },
  ]
}

export default config