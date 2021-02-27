import React, { useState } from 'react';
import { AutoComplete, Avatar, Button, Col, Row, Select, Spin, Tag } from 'antd';
import Input from 'antd/es/input';
import { DeleteTwoTone, SearchOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { cloudSearch, SearchData, searchSuggest, SearchSuggestData } from '@/services/song';
import { useRequest } from '@@/plugin-request/request';
import { useHistory } from 'umi';
import MusicList from '@/components/MusicList';

const { Option, OptGroup } = Select;

export default () => {
  const { addHistory, setSearchData, searchData } = useModel('searchHistory');
  const history = useHistory();
  const {
    run: searchSuggestRun,
    data: searchSuggestData,
  }: { run: any; data: SearchSuggestData | undefined; loading: boolean } = useRequest(
    searchSuggest,
    {
      manual: true,
    },
  ) as any;

  const {
    run: cloudSearchRun,
    loading: cloudSearchLoading,
  }: { run: any; data: SearchData; loading: boolean } = useRequest(cloudSearch, {
    manual: true,
    onSuccess: (data: any) => {
      setSearchData(data);
    },
  }) as any;

  console.info('aaaa', searchData?.result?.songs);

  return (
    <div style={{ padding: '50px 50px 0 50px' }}>
      <SearchInput
        onSearch={(v) => {
          cloudSearchRun(v);
        }}
        onTagClick={(v) => {
          cloudSearchRun(v);
        }}
        onOptionClick={({ type, id, value, item }) => {
          addHistory(value);
          if (type === 'artists') {
            history.push('/artist-music-list', { artist: item });
          } else {
            cloudSearchRun(value);
          }
        }}
        options={searchSuggestData?.result?.order?.map((it: string) => {
          switch (it) {
            case 'artists':
              return (
                <OptGroup label="歌手">
                  {searchSuggestData?.result?.artists.map((it) => (
                    <Option value={it.name} key={it.id} id={it.id} item={it} type={'artists'}>
                      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Avatar
                          src={`${it.picUrl}?param=50y50` || undefined}
                          size="small"
                          style={{ marginRight: '1em' }}
                        />
                        {it.name}
                      </div>
                    </Option>
                  ))}
                </OptGroup>
              );
            case 'songs':
              return (
                <OptGroup label="歌曲">
                  {searchSuggestData?.result?.songs.map((it) => (
                    <Option value={it.name} key={it.id} id={it.id} item={it} type={'songs'}>
                      {it.name}
                    </Option>
                  ))}
                </OptGroup>
              );
          }
          return null;
        })}
        onChange={(v) => {
          searchSuggestRun(v);
        }}
      />
      {searchData ? (
        <MusicList
          loading={cloudSearchLoading}
          list={searchData.result?.songs || searchData}
          clickType="insert"
        />
      ) : (
        <div style={{ display: 'flex', height: 50, placeItems: 'center', placeContent: 'center' }}>
          <Spin spinning={cloudSearchLoading} />
        </div>
      )}
    </div>
  );
};

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  style?: object;
  options?: React.ReactNode;
  onTagClick?: (value: string) => void;
  onChange?: (value: string) => void;
  onOptionClick?: (option: any) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder,
  style,
  options,
  onTagClick,
  onChange,
  onOptionClick,
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const { history, addHistory, clearHistory, deleteHistory } = useModel('searchHistory');

  const handleSearch = (value: string) => {
    onChange && onChange(value);
    setValue(value);
  };

  const onSelect = (value: string, option: any) => {
    onOptionClick && onOptionClick(option);
    setValue(value);
  };

  return (
    <div>
      <Input.Group compact style={{ display: 'flex' }}>
        <AutoComplete
          autoFocus
          value={value}
          dropdownMatchSelectWidth={252}
          style={{ flex: 1 }}
          onSelect={onSelect}
          onSearch={handleSearch}
          size="large"
          onInputKeyDown={(e) => {
            console.info(e.key);
            if (e.key === 'Enter' && value) {
              addHistory(value);
              onSearch(value);
            }
          }}
        >
          {options}
        </AutoComplete>
        <Button
          size="large"
          type="primary"
          onClick={() => {
            if (!value) {
              return;
            }
            addHistory(value);
            onSearch(value);
          }}
        >
          <SearchOutlined />
          Search
        </Button>
      </Input.Group>
      <Row style={{ paddingTop: 10 }} align="middle">
        <Col>
          搜索历史
          <Button
            style={{ marginLeft: '0.5em' }}
            size="small"
            shape="circle"
            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
            onClick={clearHistory}
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: 10 }}>
        {history.map((it) => (
          <Tag
            closable
            style={{ fontSize: 14, padding: '0.3em', cursor: 'pointer' }}
            onClose={() => deleteHistory(it)}
            onClick={() => {
              setValue(it);
              onTagClick && onTagClick(it);
            }}
          >
            {it}
          </Tag>
        ))}
      </Row>
    </div>
  );
};
