// SPDX-License-Identifier: GPL-3.0-only
// SPDX-FileCopyrightText: 2022 GoblinCoder <goblincoder@outlook.com>

import EasyGiving from "./EasyGiving.js";

let easyGiving = null;


Hooks.on('getItemDirectoryEntryContext', (html, entryOptions) => {
  easyGiving = new EasyGiving(entryOptions, game);
});

Hooks.on('createActor', actor => {
  easyGiving && easyGiving.addEntryOptionForCharacter(actor);
});

Hooks.on('deleteActor', actor => {
  easyGiving && easyGiving.removeEntryOptionForCharacter(actor);
});