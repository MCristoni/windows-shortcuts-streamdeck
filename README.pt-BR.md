# Shortcuts for Windows: plugin para Stream Deck e StreamDock

Plugin nativo que coloca atalhos do Windows no seu deck. A primeira ação é um **botão de Não Perturbe para o Windows 11**: aperte a tecla para ligar ou desligar o Não Perturbe, e ela sempre mostra o estado real do sistema.

<p>
  <img src="docs/images/dnd-off.png" width="96" alt="Tecla com o Não Perturbe desligado">
  &nbsp;
  <img src="docs/images/dnd-on.png" width="96" alt="Tecla com o Não Perturbe ligado">
</p>

> 🇺🇸 [Read in English](README.md). A documentação completa está em inglês.

## Recursos

- **Liga e desliga com um toque** o Não Perturbe do Windows.
- **Sempre sincronizado**: se você mudar o Não Perturbe pela Central de Notificações ou pelas Configurações, a tecla acompanha em cerca de 2 segundos.
- **Várias teclas** em páginas ou dispositivos diferentes mudam juntas.
- **Aviso de falha**: se o Windows recusar a mudança, a tecla mostra o ícone de alerta do app.
- **Sem permissão de administrador, sem internet, sem mexer no registro.**

## Compatibilidade

- ✅ Windows 11 (testado no 25H2). Windows 10 não foi testado. macOS não é suportado.
- ✅ Fifine Control Deck 3.10 com Fifine D6 (testado).
- ⚠️ Mirabox StreamDock e outros apps baseados no StreamDock: devem funcionar.
- ⚠️ Elgato Stream Deck 7.1+: feito com o SDK oficial da Elgato, ainda não testado em hardware Elgato.

## Instalação

Baixe os arquivos na [página de releases](https://github.com/MCristoni/windows-shortcuts-streamdeck/releases/latest).

**Elgato Stream Deck**
1. Baixe `com.mcristoni.windows-shortcuts.streamDeckPlugin`.
2. Dê dois cliques no arquivo.

**Fifine Control Deck / StreamDock**
1. Baixe `com.mcristoni.windows-shortcuts.sdPlugin.zip`.
2. Feche o app, inclusive na bandeja do sistema.
3. Extraia o zip em `%APPDATA%\HotSpot\StreamDock\plugins\`. O arquivo `manifest.json` precisa ficar em `...\plugins\com.mcristoni.windows-shortcuts.sdPlugin\manifest.json`.
4. Abra o app de novo.

## Uso

1. Na lista de ações, abra a categoria **Shortcuts for Windows**.
2. Arraste **Do Not Disturb Toggle** para uma tecla.
3. Aperte a tecla para alternar. Sino significa desligado. Sino com "z" significa ligado.

Ligar o Não Perturbe ativa o modo **Somente prioridade** do Windows, igual ao botão da Central de Notificações. Notificações marcadas como prioritárias em *Configurações → Sistema → Notificações* continuam aparecendo.

## Problemas comuns

- **A tecla mostra um ícone de alerta**: o plugin não conseguiu falar com o Windows. Em PCs corporativos, o PowerShell pode estar bloqueado por política. Veja os logs em `...\com.mcristoni.windows-shortcuts.sdPlugin\logs\` e [abra uma issue](https://github.com/MCristoni/windows-shortcuts-streamdeck/issues).
- **O plugin não aparece ou não reage no Fifine Control Deck**: confira se a pasta foi extraída no lugar certo e reinicie o app. O log do app fica em `%APPDATA%\HotSpot\StreamDock\logs\`.

Mais detalhes em inglês: [How to use](docs/how-to-use.md) · [How it works](docs/how-it-works.md) · [Development](docs/development.md)

## Licença

[MIT](LICENSE). Este projeto não é afiliado à Microsoft, Elgato (Corsair), Mirabox ou Fifine.
