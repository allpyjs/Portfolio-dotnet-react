import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { CloseIcon } from './svg-icons';
import { useLightMode } from '../globals/interface';
import './item-picker.css';

const ItemPicker = ({ style, items, selectedItems, setSelectedItems, placeholder, maxItems = 3, fontSize, disabled, pickerWidth = '230px' }) => {
    const lightMode = useLightMode();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedItems, setSearchedItems] = useState(items);
    const [textInputFocused, setTextInputFocused] = useState(false);

    useEffect(() => {
        const initializeSearchedItems = () => {
            if (!selectedItems)
                setSearchedItems([]);

            const initializedSerchedItems = items.filter(item =>
                !selectedItems.some(selected => selected.id === item.id)
            );
            setSearchedItems(initializedSerchedItems);
        }
        initializeSearchedItems();
    }, [items, selectedItems]);

    const removeItem = (item) => {
        setSelectedItems(selectedItems.filter((_item) => _item.id !== item.id));
        updateSearchedItems(searchQuery, selectedItems.filter((_item) => _item.id !== item.id));
    };

    const onTextInputFocused = () => {
        setTextInputFocused(true);
    };

    const onTextInputBlurred = () => {
        setSearchQuery('');
        setTimeout(() => setTextInputFocused(false), 150);
    };

    const selectItem = (item) => {
        if (!selectedItems.some(selected => selected.id === item.id)) {
            setSelectedItems([...selectedItems, item]);
        }
        setSearchQuery('');
        updateSearchedItems('', [...selectedItems, item]);
        setTextInputFocused(false);
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        updateSearchedItems(query, selectedItems);
    };

    const updateSearchedItems = (query, currentSelectedItems) => {
        const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) &&
            !currentSelectedItems.some(selected => selected.id === item.id)
        );
        setSearchedItems(filteredItems);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && searchQuery === '') {
            if (selectedItems.length > 0) {
                const lastItem = selectedItems[selectedItems.length - 1];
                removeItem(lastItem);
            }
        }
    };

    return (
        <div style={{
            ...style,
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '5px',
            border: '1.5px solid #7f8f8f', borderRadius: '5px', position: 'relative', pointerEvents: disabled ? 'none' : 'auto'
        }}>
            {selectedItems.map((item, index) => (
                <div key={index} style={{
                    height: fontSize ? `calc(${fontSize} + 5px)` : '20px', borderRadius: '10px', fontSize: fontSize ?? '15px', margin: '3px',
                    color: lightMode ? '#1f2f2f' : '#dfefef', padding: '2px',
                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                    border: `1px solid ${lightMode ? '#1f2f2f' : '#dfefef'}`
                }}>
                    &nbsp;&nbsp;{item.name}&nbsp;
                    <div style={{ cursor: 'pointer', height: fontSize ?? '18px' }} onClick={() => removeItem(item)}>
                        <CloseIcon width={fontSize ?? '18px'} height={fontSize ?? '18px'} />
                    </div>
                    &nbsp;
                </div>
            ))}
            {selectedItems.length !== maxItems && !disabled && <div style={{ flexGrow: 1, marginLeft: '5px' }}>
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
                    onKeyDown={handleKeyDown}
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
                                style={{ cursor: 'pointer', padding: '5px', fontSize: fontSize }}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
};

export default ItemPicker;
