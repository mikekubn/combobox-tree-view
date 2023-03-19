"use client";

/* eslint-disable import/order */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import { Combobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { random } from "lodash";

export interface IData {
  children?: IData[];
  id?: string;
  name?: string;
}

interface IDropdownSearchInput {
  id: string;
  name?: string;
  className?: string;
  onChange: (val: IData[]) => void;
  error?: string;
  disabled?: boolean;
  value: IData[];
  options?: IData[];
  search?: boolean;
  searchInputPlaceholder?: string;
}

export const options = (length: number): IData[] =>
  new Array(length).fill(null).map((_e, i) => ({
    name: `name ${Math.random() * i}`,
    id: `id ${Math.random() * i}`,
    children: Array(2)
      .fill(null)
      .map((_n, ind) => ({
        name: `children name ${Math.random() * i}`,
        id: `children id ${Math.random() * i}`,
        children: [
          {
            name: `sub child name ${Math.random() * ind}`,
            id: `sub child id ${Math.random() * ind}`,
          },
        ],
      })),
  }));

export const normalize = (str: string): string[] =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .split(" ");

export const hasMatch = (search: string, string: string): boolean => {
  if (!string) return false;
  const stringWords = normalize(string);
  const searchWords = normalize(search);
  return searchWords.every((searchWord) =>
    stringWords.some((stringWord) => stringWord?.match(searchWord))
  );
};

export const ComboboxTreeView = React.forwardRef<
  HTMLButtonElement,
  IDropdownSearchInput
>(
  (
    {
      id,
      name,
      error,
      className,
      value,
      options,
      search = false,
      searchInputPlaceholder,
      onChange,
    },
    ref
  ) => {
    const label = "Pick up your options";
    const hasError = error?.length;
    const [query, setQuery] = useState("");
    const [list, setList] = useState<IData[] | undefined>();

    const removeItemFromSelect = (index: number): void => {
      const arr = value?.filter((_item, i) => i !== index);
      onChange(arr);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const itemsFromFilter: IData[] = useMemo(() => [], [query]);
    const filterItems = useCallback(
      (items?: IData[]): IData[] | undefined =>
        items?.filter((item) => {
          const match = hasMatch(query, item.id + " " + item.name);

          if (item.children) {
            filterItems(item.children);
          }

          if (match) {
            if (item.children?.length) {
              return {
                id: item?.id,
                name: item?.name,
                children: filterItems(item.children),
              };
            } else {
              itemsFromFilter.push(item);
            }
          }
        }),
      [itemsFromFilter, query]
    );

    useEffect(() => {
      if (options?.length) {
        setList(options);
      }
    }, [options]);

    useEffect(() => {
      if (query?.length) {
        filterItems(list);
      }
    }, [filterItems, list, query]);

    useEffect(() => {
      if (itemsFromFilter?.length) {
        const arr = itemsFromFilter.slice(0, 50);
        const filtered = arr.filter((element, index) => {
          return arr.indexOf(element) === index;
        });
        setList(filtered);
      }

      return (): void => setList(options);
    }, [itemsFromFilter, options]);

    return (
      <div className={clsx(className, "flex flex-col relative")}>
        <label
          id={id}
          htmlFor={id}
          className="text-sm text-primary flex flex-row items-center pb-0.5"
        >
          {label}
        </label>
        <Combobox as="div" value={value} onChange={onChange} multiple>
          <div className="relative">
            <Combobox.Button
              ref={ref}
              name={name}
              id={`input-${id}`}
              data-cy={`input-${id}`}
              className={clsx(
                "inline-flex flex-1 focus-expanded min-h-[40px] overflow-hidden overflow-x-scroll hide-scroll-bar text-sm text-primary w-full appearance-none rounded-md border border-shadow hover:border-secondary active:border-green focus:ring-1 focus:ring-blue disabled:cursor-not-allowed disabled:bg-shadow/80 disabled:border-shadow",
                {
                  "border-red text-red": hasError,
                }
              )}
            >
              <ButtonChildren
                label={label}
                items={value}
                toggleSelect={(val): void => removeItemFromSelect(val)}
              />
            </Combobox.Button>
            <Transition
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={(): void => setQuery("")}
            >
              <Combobox.Options className="absolute max-h-60 w-full overflow-auto bg-white z-10 hide-scroll-bar pb-2 px-2 mt-1 pt-1 appearance-none rounded-md border border-black">
                <SearchInput
                  className={clsx({
                    relative: search,
                    hidden: !search,
                  })}
                  query={query}
                  setQuery={setQuery}
                  searchInputPlaceholder={searchInputPlaceholder}
                />
                {list?.map((option, index) => (
                  <Option
                    key={index}
                    value={option}
                    selectedItems={value}
                    setSelectedItems={onChange}
                  />
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
        {hasError && <div className="border-red text-red mx-auto">{error}</div>}
      </div>
    );
  }
);

const Option = ({
  value,
  selectedItems,
  setSelectedItems,
  className,
  style,
}: {
  value: IData;
  selectedItems: IData[];
  setSelectedItems: (val: IData[]) => void;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const eq = selectedItems?.some(
    (item) => JSON.stringify(item) === JSON.stringify(value)
  );

  return (
    <>
      <Combobox.Option
        data-cy="list-option"
        value={value}
        onClick={(e): void => {
          if (value.children?.length) {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
          if (eq) {
            e.preventDefault();
            const arr = selectedItems?.filter(
              (item) => JSON.stringify(item) !== JSON.stringify(value)
            );

            return setSelectedItems(arr);
          }
        }}
        style={style}
        className={clsx(
          className,
          "relative flex flex-row flex-1 items-center cursor-pointer text-primary select-none p-2 hover:bg-primary/10 rounded-lg my-1",
          {
            "!text-primary bg-secondary/20": eq,
          }
        )}
      >
        <>
          <div
            className={clsx({
              "w-6 block": value.children?.length,
              hidden: !value.children?.length,
            })}
          >
            <ChevronDownIcon
              className={clsx("h-4 w-4", {
                "rotate-180": expanded,
              })}
            />
          </div>
          <p className="mr-1 px-1 rounded-md text-xs text-white bg-green">
            {value.id}
          </p>
          <p className="text-xs md:text-sm">{value.name}</p>
        </>
      </Combobox.Option>
      {expanded && (
        <>
          {value.children?.map((item, index) => (
            <Option
              key={index}
              value={item}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
              className={clsx({
                "ml-4": item?.children?.length,
                "ml-12": !item?.children?.length,
              })}
            />
          ))}
        </>
      )}
    </>
  );
};

const ButtonChildren = ({
  items,
  label,
  toggleSelect,
}: {
  items: IData[];
  label: string;
  toggleSelect: (item: number) => void;
}): React.ReactElement => (
  <div className="inline-flex flex-1 items-center rounded-md min-h-[40px]">
    <div className="flex flex-1 p-3">
      {items?.length > 0 ? (
        <ul
          data-cy="button-list"
          className="inline-flex flex-wrap gap-1.5 text-primary"
        >
          {items?.map((item, index) => (
            <li
              key={item.id}
              className="inline-flex items-center cursor-pointer"
              onClick={(e): void => {
                e.stopPropagation();
                toggleSelect(index);
              }}
            >
              <div className="inline-flex flex-1 justify-between items-center rounded-lg bg-primary text-white p-1">
                <p className="text-xs bg-white text-primary rounded-md p-0.5 mr-1 min-w-[20px]">
                  {item.id}
                </p>
                <p className="whitespace-nowrap text-xs">{item?.name}</p>
                <XMarkIcon className="w-3 h-3 ml-1" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-sm inline-flex text-start text-primary">
          {label}
        </span>
      )}
    </div>
    <div className="inline-flex px-2 right-0 rounded-r-md h-full absolute">
      <div className="flex flex-col justify-center">
        <ChevronDownIcon
          className="h-5 w-5 text-matt-blue-dark-700"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
);

const SearchInput = ({
  className,
  query,
  setQuery,
  searchInputPlaceholder,
}: {
  className?: string;
  query: string;
  setQuery: (query: string) => void;
  searchInputPlaceholder?: string;
}): React.ReactElement => (
  <div className={className} data-cy="dropdown-search">
    <input
      className="mb-2 text-sm placeholder-shadow text-shadow border border-black rounded-lg w-full h-10 p-3"
      id="input"
      name="search-input-dropdown"
      type="text"
      placeholder={searchInputPlaceholder}
      value={query}
      onChange={(e): void => setQuery(e.target.value)}
      data-cy="dropdown-search-input"
    />
    <MagnifyingGlassIcon
      className={clsx(
        "h-6 w-6 absolute top-2 right-2 text-primary cursor-pointer",
        { block: Boolean(!query), hidden: Boolean(query) }
      )}
      data-cy="dropdown-search-magnifying-glass-icon"
    />
    <XMarkIcon
      className={clsx(
        "h-6 w-6 absolute top-2 right-2 text-primary cursor-pointer",
        { block: Boolean(query), hidden: Boolean(!query) }
      )}
      onClick={(): void => setQuery("")}
      data-cy="dropdown-search-x-mark-icon"
    />
  </div>
);

ComboboxTreeView.displayName = "ComboboxTreeView";

export default ComboboxTreeView;
