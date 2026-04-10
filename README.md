

https://github.com/user-attachments/assets/301c6a99-53ce-4306-a528-85259c70fa66


# myNaksh

Fresh Expo Router starter project.

## Run

# myNaksh Chat App

React Native + Expo chat experience for astrologer conversations, with swipe reply, long-press reactions, and session rating.

## Steps to Run the App

1. Install dependencies:

```bash
npm install
```

2. Start Expo development server:
   
```bash
npx expo start -c
```

3. Run on a platform:
- Press `i` in terminal for iOS simulator
- Press `a` in terminal for Android emulator
- Scan QR in Expo Go for physical device

Optional direct commands:

```bash
npm run ios
npm run android
npm run web
```

## Brief Explanation

### How Reanimated was used
- `react-native-reanimated` is used for gesture-driven UI animations in chat messages.
- In `SwipeReplyMessage`, animated shared values control:
	- swipe translation (`translateX`)
	- reply icon opacity/scale interpolation
	- reaction bar show/hide animation
	- dislike chips expand/collapse animation
- Animations are driven with `withTiming`, `withSpring`, and `useAnimatedStyle` for smooth native-thread rendering.

### Gesture handling approach
- `react-native-gesture-handler` powers interaction in each message bubble.
- `Pan` gesture is used for swipe-to-reply with threshold trigger.
- `LongPress` opens message reactions.
- `Tap` closes reaction bar when needed.
- Gestures are composed using `Gesture.Race`/`Gesture.Simultaneous` to avoid conflicts between swipe, long-press, and tap behavior.

### State management choice (Redux)
- Redux Toolkit is used to keep chat state centralized and predictable.
- Store setup lives in `store/store.ts`, with chat logic in `store/chatSlice.ts`.
- Redux stores:
	- chat messages
	- draft input
	- reply target message
	- reactions
	- AI feedback state (like/dislike + reason)
- `ChatScreen` uses `useSelector` for reads and `useDispatch` for actions, so newly sent messages and reactions are preserved in app state.
