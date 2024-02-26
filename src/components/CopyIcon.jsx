export function CopyIcon({ copyValue }) {
  const handleClick = () => {
    navigator.clipboard
      .writeText(copyValue)

      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icons"
      onClick={handleClick}
    >
      <path
        d="M8.25 7.8125C7.73223 7.8125 7.3125 8.23223 7.3125 8.75V15.5C7.3125 16.0178 7.73223 16.4375 8.25 16.4375H15C15.5178 16.4375 15.9375 16.0178 15.9375 15.5V8.75C15.9375 8.23223 15.5178 7.8125 15 7.8125H8.25ZM6.1875 8.75C6.1875 7.61091 7.11091 6.6875 8.25 6.6875H15C16.1391 6.6875 17.0625 7.61091 17.0625 8.75V15.5C17.0625 16.6391 16.1391 17.5625 15 17.5625H8.25C7.11091 17.5625 6.1875 16.6391 6.1875 15.5V8.75Z"
        fill="#0465DD"
      />
      <path
        d="M3 2.5625C2.75136 2.5625 2.5129 2.66127 2.33709 2.83709C2.16127 3.0129 2.0625 3.25136 2.0625 3.5V10.25C2.0625 10.4986 2.16127 10.7371 2.33709 10.9129C2.5129 11.0887 2.75136 11.1875 3 11.1875H3.75C4.06066 11.1875 4.3125 11.4393 4.3125 11.75C4.3125 12.0607 4.06066 12.3125 3.75 12.3125H3C2.45299 12.3125 1.92839 12.0952 1.54159 11.7084C1.1548 11.3216 0.9375 10.797 0.9375 10.25V3.5C0.9375 2.95299 1.1548 2.42839 1.54159 2.04159C1.92839 1.6548 2.45299 1.4375 3 1.4375H9.75C10.297 1.4375 10.8216 1.6548 11.2084 2.04159C11.5952 2.42839 11.8125 2.95299 11.8125 3.5V4.25C11.8125 4.56066 11.5607 4.8125 11.25 4.8125C10.9393 4.8125 10.6875 4.56066 10.6875 4.25V3.5C10.6875 3.25136 10.5887 3.0129 10.4129 2.83709C10.2371 2.66127 9.99864 2.5625 9.75 2.5625H3Z"
        fill="#0465DD"
      />
    </svg>
  );
}
