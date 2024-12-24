import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useLightMode } from '../globals/interface';
import './column-box.css';

const ColumnBox = ({ style, items, setSelectedItem, placeholder, fontSize, disabled, pickerWidth = '230px' }) => {
    const lightMode = useLightMode();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedItems, setSearchedItems] = useState(items);
    const [textInputFocused, setTextInputFocused] = useState(false);

    useEffect(() => {
        updateSearchedItems(searchQuery);
    }, [items]);

    const onTextInputFocused = () => {
        setTextInputFocused(true);
    };

    const onTextInputBlurred = () => {
        setTimeout(() => setTextInputFocused(false), 150);
    };

    const selectItem = (item) => {
        setSearchQuery(item.name);
        updateSearchedItems(item.name);
        setSelectedItem(item);
        setTextInputFocused(false);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        updateSearchedItems(query);
    };

    const updateSearchedItems = (query) => {
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchedItems(filteredItems);
    };

    return (
        <div style={{
            ...style,
            padding: '5px', pointerEvents: disabled ? 'none' : 'auto',
            border: '1.5px solid #7f8f8f', borderRadius: '5px', position: 'relative',
        }}>
            <TextField
                variant="standard"
                placeholder={placeholder}
                InputProps={{
                    disableUnderline: true,
                }}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={onTextInputFocused}
                onBlur={onTextInputBlurred}
                sx={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    '& .MuiInputBase-input': {
                        color: lightMode ? '#1f2f2f' : '#dfefef',
                        fontSize: fontSize
                    },
                }}
            />
            {(textInputFocused && searchedItems.length !== 0) && (
                <div style={{
                    backgroundColor: lightMode ? '#d3e3e3' : '#1f2f2f',
                    width: {pickerWidth},
                    border: '1px solid #7f8f8f', position: 'absolute',
                    display: 'flex', flexDirection: 'column',
                    maxHeight: '90px', overflowY: 'auto', zIndex: 9999
                }}>
                    {searchedItems.map((item, index) => (
                        <div
                            key={index}
                            className={lightMode ? 'list-item-light' : 'list-item-dark'}
                            onMouseDown={() => selectItem(item)}
                            style={{ cursor: 'pointer', padding: '5px', width: pickerWidth, fontSize: fontSize, textAlign: 'left', justifyContent: 'left' }}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColumnBox;
