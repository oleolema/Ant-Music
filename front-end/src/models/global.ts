import {useState} from 'react';

export default () => {
  const [__locationState, __setLocationState] = useState<any>({});
  return {
    __locationState,
    __setLocationState,
  };
};
