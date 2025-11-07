'use client';

import { IEditor, ReactCodeblockPlugin } from '@lobehub/editor';
import { Editor, useEditor } from '@lobehub/editor/react';
// import { Button } from '@lobehub/ui';
import { Spin } from 'antd';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

// import { useAccountChangeNickname } from '@/lib/http';
// import { templateSelectors } from '@/store/template/selectors';
// import { useTemplateStore } from '@/store/template/store';

export default function Home() {
  const editor = useEditor();
  const [content, setContent] = useState<string>('###123###');
  console.log('>>>>', content);
  // const simpleValue = useTemplateStore((s) => s.simpleValue);
  // const templating = useTemplateStore(templateSelectors.templating);
  // const useTemplateList = useTemplateStore((s) => s.useFetchTemplate);

  // const { data: templateList, isLoading } = useTemplateList({});

  // const changeNickName = useAccountChangeNickname({
  //   mutation: {
  //     onMutate: (_, context) => {
  //       context.client.invalidateQueries({ queryKey: ['task'] });
  //     },
  //   },
  // });

  // console.log('templateList', templateList, isLoading);
  // console.log('templating', templating);
  // console.log('simpleValue', simpleValue);

  const handleInit = (editor: IEditor) => {
    console.log('Editor initialized:', editor);
  };

  /**
   * ###tag####tag# balalala #tag # balalala
   * ##[#tag#]##[#tag#] balalala [#tag #] balalala
   */
  const wrapClosestHashWithLink = (text: string): React.ReactNode => {
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

  return (
    <Spin spinning={false}>
      <main className="container mx-auto flex flex-col gap-4 p-6">
        <h1 className="font-bold text-2xl">Hello, world.</h1>
        <Flexbox style={{ border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
          <Editor
            content={content}
            editor={editor}
            enablePasteMarkdown={false}
            markdownOption={false}
            onChange={(editor) => {
              const text = String(editor.getDocument('markdown') || '').trimEnd();
              console.log('Content changed:', text);
              setContent(text);
            }}
            onInit={handleInit}
            placeholder="Start typing..."
            plugins={[ReactCodeblockPlugin]}
            type="text"
            variant="chat"
          />
        </Flexbox>
        <p style={{ whiteSpace: 'pre-wrap' }}>{wrapClosestHashWithLink(content)}</p>
      </main>
    </Spin>
  );
}
