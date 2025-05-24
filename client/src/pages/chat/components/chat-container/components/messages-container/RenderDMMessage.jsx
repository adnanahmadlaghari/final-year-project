import React from 'react'

const RenderDMMessage = (message) => {
  return (
    <div
    className={`${
      message.sender !== selectedChatData._id ? "text-left" : "text-right"
    }`}
  >
    {message.messageType === "text" && (
      <div
        className={`${
          message.sender !== selectedChatData._id
            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
      >
        {message.content}
      </div>
    )}
    <div className="text-xs text-gray-600 ">
      {moment(message.timestamp).format("LT")}
    </div>
  </div>
  )
}

export default RenderDMMessage