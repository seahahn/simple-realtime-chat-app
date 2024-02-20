import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {AvatarImage, AvatarFallback, Avatar} from "~/components/ui/avatar";
import {Form, useLoaderData} from "@remix-run/react";
import {useEffect, useRef, useState} from "react";
import {connect} from "~/lib/ws.client";
import type {Socket} from "socket.io-client";
import {LoaderFunctionArgs, json} from "@remix-run/node";
import {getUser, requireUserId} from "~/lib/auth.server";
import {UserSession} from "~/constants/types";

interface ServerMsgType {
  userId: string;
  nickname: string;
  message?: string;
  fromServer?: boolean;
}

interface MessageType extends ServerMsgType {
  message: string;
}

interface ParticipantType {
  userId: string;
  nickname: string;
}

export async function loader({request}: LoaderFunctionArgs) {
  await requireUserId(request);
  const user = await getUser(request);
  return json({user});
}

export default function Chat() {
  const {user} = useLoaderData<{user: UserSession}>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [msgInput, setMsgInput] = useState("");
  const [msgs, setMsgs] = useState<MessageType[]>([]);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);

  const [socket, setSocket] = useState<Socket>();

  const chatRef = useRef<HTMLDivElement>(null);
  const msgInputRef = useRef<HTMLInputElement>(null);

  // Create a new chat connection
  useEffect(() => {
    const connection = connect();
    setSocket(connection);
    return () => {
      connection.close();
    };
  }, []);

  // Listen for messages and participants list
  useEffect(() => {
    if (!socket) return;
    socket.emit("join", {
      userId: user.id,
      nickname: user.nickname,
    } satisfies ServerMsgType);

    socket.on("message", (data: MessageType) => {
      setMsgs((prev) => [...prev, data]);
    });

    socket.on("participant", (data: ParticipantType[]) => {
      setParticipants(data);
    });
  }, [socket, user.id, user.nickname]);

  // Effect to scroll to bottom when chat is resized or messages change
  useEffect(() => {
    if (isChatScrolledToBottom()) chatRef.current?.scrollTo({top: chatRef.current?.scrollHeight});
  }, [msgs]);

  // Function to check if the chat is scrolled to the bottom
  const isChatScrolledToBottom = () => {
    if (!chatRef.current) return false;
    const {scrollTop, clientHeight, scrollHeight} = chatRef.current;
    return scrollTop + clientHeight / scrollHeight >= 0.8;
  };

  const handleSidebarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!msgInput) return;

    socket?.emit("message", {
      userId: user.id,
      nickname: user.nickname,
      message: msgInput,
    } satisfies MessageType);

    setMsgInput("");
    msgInputRef.current?.focus();
  };

  return (
    <main className="h-screen bg-white flex justify-center">
      <Form className="mt-16 flex-1 p-4 flex flex-col space-y-4" onSubmit={handleInputSubmit}>
        <div ref={chatRef} className="flex flex-col flex-1 overflow-auto space-y-2">
          {msgs.map((msg, i) => {
            if (msg.fromServer) return <MessageFromServer key={i} message={msg.message} />;
            if (msg.userId !== user.id)
              return <MessageFromOther key={i} username={msg.nickname} message={msg.message} />;
            return <MessageFromMe key={i} message={msg.message} />;
          })}
        </div>
        <div className="flex space-x-2">
          <Input
            ref={msgInputRef}
            value={msgInput}
            className="flex-1"
            placeholder="Type a message..."
            onChange={handleInputChange}
          />
          <Button variant="secondary">Send</Button>
        </div>
      </Form>
      <aside className="mt-16 w-64 p-4 space-y-4 bg-gray-100" hidden={!isSidebarOpen}>
        <header className="text-lg font-semibold">Participants</header>
        <div className="space-y-2">
          {participants.map((participant, i) => (
            <ParticipantItem key={i} username={participant.nickname} />
          ))}
        </div>
      </aside>
      <Button
        className="absolute top-20 right-2 p-2"
        size="sm"
        variant="outline"
        onClick={handleSidebarOpen}>
        {isSidebarOpen ? (
          <RightArrowIcon className="h-6 w-6" />
        ) : (
          <LeftArrowIcon className="h-6 w-6" />
        )}
      </Button>
    </main>
  );
}

const RightArrowIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
};

const LeftArrowIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(180)">
      <RightArrowIcon />
    </svg>
  );
};

const MessageFromOther = ({username, message}: {username: string; message: string}) => {
  return (
    <div className="flex flex-col items-start justify-start">
      <div className="text-xs">{username}</div>
      <div className="flex items-end space-x-1">
        <p className="max-w-xs p-2 bg-gray-200 rounded-lg">{message}</p>
        <time className="text-xs">{new Date(Date.now()).toDateString()}</time>
      </div>
    </div>
  );
};

const MessageFromMe = ({message}: {message: string}) => {
  return (
    <div className="flex items-end justify-end space-x-1">
      <span className="text-xs">{new Date(Date.now()).toDateString()}</span>
      <p className="max-w-xs p-2 bg-blue-500 text-white rounded-lg">{message}</p>
    </div>
  );
};

const MessageFromServer = ({message}: {message: string}) => {
  return (
    <div className="flex items-center justify-center">
      <p className="max-w-xs p-2 text-gray-500 rounded-lg">{message}</p>
    </div>
  );
};

const ParticipantItem = ({username}: {username: string}) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage alt={username} src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback>{username.substring(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>{username}</div>
    </div>
  );
};
