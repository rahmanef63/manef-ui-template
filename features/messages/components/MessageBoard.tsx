import { useCurrentTeam } from "@/features/teams/hooks/useTeamState";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createMessageRef, listMessagesRef } from "@/shared/convex/messages";
import { handleFailure } from "@/shared/errors/handleFailure";
import { useMutation, usePaginatedQuery } from "convex/react";
import Image from "next/image";
import { useCallback, useRef, useState, type FormEvent } from "react";

export function MessageBoard() {
  const team = useCurrentTeam();
  const {
    results: messages,
    loadMore,
    status,
  } = usePaginatedQuery(
    listMessagesRef,
    team == null ? "skip" : { teamId: team._id },
    { initialNumItems: 10 }
  );
  const [message, setMessage] = useState("");
  const sendMessage = useMutation(createMessageRef);
  const listRef = useRef<HTMLElement>(null);
  const handleScroll = useCallback(() => {
    if (listRef.current === null) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      status === "CanLoadMore"
    ) {
      loadMore(10);
    }
  }, [loadMore, status]);
  const handleSubmit = handleFailure(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (team == null) {
      return;
    }
    await sendMessage({ text: message, teamId: team._id });
    setMessage("");
  });

  return (
    <div className="max-w-xl flex flex-col gap-2 mt-8">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Textarea
          name="message"
          placeholder="Message text..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button disabled={message.trim() === ""} type="submit">
          Send Message
        </Button>
      </form>
      <ScrollArea className="h-72 rounded-md border" onScroll={handleScroll}>
        <div className="p-4">
          {messages.map((message) => (
            <div key={message._id} className="text-sm">
              <div className="flex">
                <Image
                  src={
                    message.authorPictureUrl ??
                    `https://avatar.vercel.sh/${message.author}.png`
                  }
                  alt={`${message.author} avatar`}
                  className={cn(
                    "rounded-full inline-block mr-2 mt-[0.1875rem] w-8 h-8",
                    message.isAuthorDeleted && "grayscale"
                  )}
                  width={32}
                  height={32}
                  sizes="32px"
                  unoptimized
                />
                <div>
                  <div>
                    <span
                      className={cn(
                        "font-semibold",
                        message.isAuthorDeleted && "text-muted-foreground"
                      )}
                    >
                      {message.author}
                    </span>{" "}
                    <span className="text-muted-foreground text-xs whitespace-nowrap self-end">
                      {formatDateTime(message._creationTime)}
                    </span>
                  </div>
                  {message.text}
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
          {status === "Exhausted" && messages.length === 0 && (
            <div className="text-muted-foreground">
              There are no messages posted yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const FULL_DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
  dateStyle: "short",
});

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

function formatDateTime(timestamp: number) {
  const isToday =
    new Date(timestamp).setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0);
  if (isToday) {
    return TIME_FORMAT.format(timestamp);
  }
  return FULL_DATE_TIME_FORMAT.format(timestamp);
}
