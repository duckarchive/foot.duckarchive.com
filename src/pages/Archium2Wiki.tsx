import { HStack, Textarea } from "@chakra-ui/react";
import { useState } from "react";

const WIKI_TABLE_HEADER = `{| class="wikitable sortable" style="width: 100%;"
! Номер !! Назва !! Роки !! Кількість аркушів
|-`;

const Archium2WikiPage: React.FC = () => {
  const [wikiFormattedText, setWikiFormattedText] = useState<string>("");

  const handleArchiumTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const rows = value.split("\n");

    interface RowData {
      name?: string;
      date?: string;
      pages?: string;
    }

    const result: Record<string, RowData> = {};
    let activeKey = "";
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // console.log(row);
      if (/^Справа\s?\d+(\s?[а-я])?(\s[а-я]\.\s\d+)?$/.test(row)) {
        const rest = row.split(" ").slice(1);
        activeKey = rest.join("").toUpperCase().trim().replace(/\.|,|\s/g, "");
      } else if (/^\d{4}(-\d{4})?$/.test(row)) {
        if (!result[activeKey]) {
          result[activeKey] = {};
        }
        result[activeKey].date = row;
      } else {
        if (!result[activeKey]) {
          result[activeKey] = {};
        }
        const parts = row
          .replace(/, (\d)/g, "___$1")
          .split("___")
          .filter(Boolean);

        if (parts.length < 3) {
          const [name, pagesCountRaw] = parts;

          result[activeKey].name = name;
          result[activeKey].pages = pagesCountRaw.split(" ")[0];
        } else {
          const [name, date, pagesCountRaw] = parts;

          result[activeKey].name = name;
          result[activeKey].date = date;
          result[activeKey].pages = pagesCountRaw.split(" ")[0];
        }
      }
    }

    const formatted = Object.entries(result)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(
        ([idx, { name, date, pages }]) =>
          `|[[/${idx}/]]||${name}||${date || " "}||${pages}`
      )
      .join("\n|-\n");

    setWikiFormattedText(WIKI_TABLE_HEADER + "\n" + formatted + "\n|-\n|}");
  };

  return (
    <HStack w="100vw" h="90vh">
      <Textarea
        w="50%"
        h="full"
        resize="none"
        placeholder="Скопіюйте текст з сайту архіуму, та вставте сюди"
        onChange={handleArchiumTextChange}
        bg="white"
      />
      <Textarea
        w="50%"
        h="full"
        resize="none"
        placeholder="Відформатований текст для вікіпедії буде тут."
        bg="white"
        value={wikiFormattedText}
        readOnly
      />
    </HStack>
  );
};

export default Archium2WikiPage;
