import { AppDispatcher } from './Dispatcher';
import { State } from './Store';

export const CounterActionTypes = {
    INCREMENT_COUNT: 'INCREMENT_COUNT',
    DECREMENT_COUNT: 'DECREMENT_COUNT'
};

export const UserActionTypes = {
    SAVE_USER: 'SAVE_USER',
};

export const StoreActionTypes = {
    LOAD_STATE: 'LOAD_STATE',
};

export const StoreActions = {
    loadState: (state: State) => {
        AppDispatcher.dispatch({
            type: StoreActionTypes.LOAD_STATE,
            payload: state,
        });
    },
}

export const CounterActions = {
    increment: (value: number) => {
        AppDispatcher.dispatch({
            type: CounterActionTypes.INCREMENT_COUNT,
            payload: value,
        });
    },
    decrement: (value: number) => {
        AppDispatcher.dispatch({
            type: CounterActionTypes.DECREMENT_COUNT,
            payload: value,
        });
    },
};

export const UserActions = {
    saveUser: (user: { name: string; age: number }) => {
        AppDispatcher.dispatch({
            type: UserActionTypes.SAVE_USER,
            payload: user,
        });
    },
};