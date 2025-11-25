/**
 * LangGraph workflow creation
 */
import { AIMessage } from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

/**
 * Creates LangGraph workflow for agent execution
 */
export function createWorkflow(model: ChatOpenAI, tools: StructuredToolInterface[]) {
  const modelWithTools = model.bindTools(tools);
  const toolNode = new ToolNode(tools);

  const llmNode = async (state: typeof MessagesAnnotation.State) => {
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] };
  };

  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('llm', llmNode)
    .addNode('tools', toolNode)
    .addEdge(START, 'llm')
    .addEdge('tools', 'llm')
    .addConditionalEdges('llm', state => {
      const lastMessage = state.messages.at(-1);
      if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
        return 'tools';
      }
      return END;
    });
  return workflow.compile();
}
