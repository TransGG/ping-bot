import type {
  MessageActionRow,
  MessageAttachment,
  MessageEmbedOptions,
  MessageMentionOptions,
  InteractionReplyOptions,
} from "discord.js";

export interface MenuOptions {
  type: string;
  embeds?: MessageEmbedOptions[];
  rows: MessageActionRow[];
  ephemeral?: boolean;
  files?: MessageAttachment[];
  mentions?: MessageMentionOptions;
  persist?: boolean;
}

export class Menu {
  payload: InteractionReplyOptions;
  ephemeral: boolean;
  constructor(payload: InteractionReplyOptions, ephemeral: boolean) {
    this.payload = payload;
    this.ephemeral = ephemeral;
  }
}

/**
 * Menu
 * @param {string} options.type menu type determines what handler will be used when an interaction is called
 * @param {MessageEmbedOptions[]} options.embeds embeds to send with the menu
 * @param {MessageActionRow[]} options.rows action rows to send with the menu
 * @param {boolean} options.ephemeral whether or not the menu should be ephemeral (defaults to true)
 * @param {MessageAttachment[]} options.files files to send with the menu
 * @param {MessageMentionOptions} options.mentions mentions to allow in the menu
 * @param {boolean} options.persist whether or not the menu should persist on a restart, requires a mongoDB server to be configured within the menuManager (defaults to false)
 */
export class MenuType {
  persist: boolean;
  type: string;
  embeds: MessageEmbedOptions[] | undefined;
  rows: MessageActionRow[];
  files: MessageAttachment[] | undefined;
  ephemeral: boolean;
  mentions: MessageMentionOptions | undefined;
  private iterations!: number;
  constructor(opts: MenuOptions) {
    this.type = opts.type;
    this.embeds = opts.embeds;
    this.rows = opts.rows;
    this.files = opts.files;
    this.mentions = opts.mentions;
    this.ephemeral = opts.ephemeral ?? true;
    this.persist = opts.persist ?? false;
  }

  private iterate(): string {
    if (this.iterations === undefined) {
      this.iterations = 0;
    }

    if (this.iterations == 1023) {
      this.iterations = 0;
    }

    this.iterations++;

    return this.iterations.toString(32);
  }

  /**
   * Creates a new instance of the menu
   */
  public build(): Menu {
    let menu = new Menu(this);

    let id = `menu:${this.type}:${Date.now().toString(32)}:${this.iterate()}`;

    for (let a = 0; a < rows.length; a++) {
      let components = rows[a]!.components;

      for (let b = 0; b < components.length; b++) {
        // id mapping
        let cid = `${id}:${a}:${b}`;
        if (typeof components[b]!.customId === "string") {
          idmap.set(cid, components[b]!.customId!);
        } else {
          idmap.set(cid, cid);
        }
        components[b]!.customId = cid;
      }
    }

    let payload: InteractionReplyOptions = { ephemeral: this.ephemeral };
    if (this.embeds) {
      payload.embeds = this.embeds;
    }
    if (this.rows) {
      payload.components = this.rows;
    }
    if (this.files) {
      payload.files = this.files;
    }
    if (this.mentions) {
      payload.allowedMentions = this.mentions;
    }

    return menu;
  }
}
