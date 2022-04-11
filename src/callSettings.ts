import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "port",
      type: "number",
      default: "",
      description:
        "If you are using a local mermaid.ink server, indicate the port number that mermaid.ink is running on. If you want to use https://mermaid.ink, then leave this field blank.",
      title: "Port number",
    },
  ];

  logseq.useSettingsSchema(settings);
};
