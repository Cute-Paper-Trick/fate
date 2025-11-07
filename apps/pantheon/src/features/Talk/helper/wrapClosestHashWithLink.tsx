/**
 * ###tag####tag# balalala #tag # balalala
 * ##[#tag#]##[#tag#] balalala [#tag #] balalala
 */
export const wrapClosestHashWithLink = (text: string): React.ReactNode => {
  // 使用正则表达式匹配所有可能的 # ... # 对
  // 使用 lazy match (.*?) 来优先匹配最短的距离
  const regex = /#(\s*[^#\s]+(?:\s+[^#\s]+)*\s*)#/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加匹配前的文本
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // 添加链接元素
    parts.push(
      <a className="tag" href="javascript:void(0)" key={match.index}>
        #{match[1]}#
      </a>,
    );

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的文本
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};
