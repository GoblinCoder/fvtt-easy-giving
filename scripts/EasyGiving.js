// SPDX-License-Identifier: GPL-3.0-only
// SPDX-FileCopyrightText: 2022 GoblinCoder <goblincoder@outlook.com>

const CHARACTER = "character"

export default class EasyGiving {
  #entryOptions;

  constructor(entryOptions) {
    this.#entryOptions = entryOptions;

    const initialCharacterEntryOptions = this.#createCharacterEntryOptions(game.actors);
    initialCharacterEntryOptions.forEach(option => this.#entryOptions.push(option))
  }

  addEntryOptionForCharacter(actor) {
    if (actor.data.type === CHARACTER) {
      const newItemContextOption = this.#createActorEntryOption(actor);
      this.#entryOptions.push(newItemContextOption);
    }
  }

  removeEntryOptionForCharacter(actor) {
    if (actor.data.type === CHARACTER) {
      const actorId = actor.data._id;
      const actorEntryOptionIndex = this.#entryOptions.findIndex(e => e.actorId === actorId);
      this.#entryOptions.splice(actorEntryOptionIndex, 1);
    }
  }

  #createCharacterEntryOptions(actors) {
    return actors
      .filter(actor => actor.data.type === CHARACTER)
      .map(actor => this.#createActorEntryOption(actor));
  }

  #createActorEntryOption(actor) {
    const giveToLocalization = game.i18n.localize("EASY_GIVING.GiveTo");

    return {
      name: `${giveToLocalization} ${actor.data.name}`,
      actorId: actor.data._id,
      icon: '<i class="fa fa-gift"></i>',
      condition: li => game.user.isGM,
      callback: li => {
        const itemId = li.data("documentId");
        this.#giveItemToActor(actor, itemId);
        this.#sentChatMessageForReceivedItem(actor, this.#getItem(itemId));
      }
    };
  }

  #sentChatMessageForReceivedItem(actor, item) {
    const youHaveReceivedTheItem = game.i18n.localize("EASY_GIVING.YouHaveReceivedTheItem");

    const chatMessage = {
      content: `${actor.data.name}: ${youHaveReceivedTheItem} "${item.data.name}"`,
      type: CONST.CHAT_MESSAGE_TYPES.OOC
    };

    ChatMessage.create(chatMessage);
  }

  #giveItemToActor(actor, itemId) {
    const itemsToGive = [
      game.items.get(itemId)
    ];

    actor.addEmbeddedItems(itemsToGive, false);
  }

  #getItem = itemId => game.items.find(item => item.data._id === itemId);
}