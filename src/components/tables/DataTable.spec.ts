import { describe, expect, it } from 'vitest';
import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import DataTable from '@/components/tables/DataTable.vue';
import TablePagination from '@/components/tables/TablePagination.vue';
import { RuiSimpleSelect } from '~/src';
import type { TableColumn } from '@/components/tables/TableHead.vue';

interface User {
  id: number;
  name: string;
  title: string;
  email: string;
}

function createWrapper(options?: ComponentMountingOptions<typeof DataTable<User>>) {
  return mount(DataTable<User>, {
    ...options,
    global: {
      provide: {
        [TableSymbol.valueOf()]: createTableDefaults({
          limits: [5, 10, 15, 25, 50, 100, 200],
        }),
      },
    },
  });
}

describe('dataTable', () => {
  const data: User[] = [
    ...[...new Array(50)].map((_, index) => ({
      email: `lindsay.walton${index}@example.com`,
      id: index + 1,
      name: `Lindsay Walton ${index}`,
      title: index % 2 === 0 ? 'Back-end Developer' : 'Front-end Developer',
    })),
  ];

  const columns: TableColumn<User>[] = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      align: 'end',
      key: 'name',
      label: 'Full name',
      sortable: true,
    },
    {
      align: 'start',
      key: 'title',
      label: 'Job position',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email address',
      sortable: true,
    },
    {
      key: 'action',
    },
  ];

  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
        cols: columns,
        rowAttr: 'id',
        rows: data,
      },
    });

    expect(wrapper.get('table').classes()).toMatch(/_table_/);
    expect(wrapper.find('table thead').exists()).toBeTruthy();
    expect(wrapper.find('table tbody').exists()).toBeTruthy();
  });

  it('passes props correctly', async () => {
    const wrapper = createWrapper({
      props: {
        'cols': columns,
        'dense': true,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'outlined': true,
        'pagination': { limit: 10, page: 1, total: 50 },
        'rowAttr': 'id',
        'rows': data,
        'search': '',
        'sort': [{ column: 'name', direction: 'asc' }],
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });
    expect(
      wrapper.find('table thead th[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_checkbox_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__start_]').exists(),
    ).toBeTruthy();
    expect(
      wrapper.find('table tbody td[class*=_align__start_]').exists(),
    ).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_limit_]').exists()).toBeTruthy();
    expect(wrapper.find('div div[class*=_navigation_]').exists()).toBeTruthy();
    expect(
      wrapper.find('div div[class*=_navigation_] button[disabled]').exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();
  });

  it('multiple expand toggles correctly', async () => {
    const wrapper = createWrapper({
      props: {
        'cols': columns,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'rowAttr': 'id',
        'rows': data,
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });

    expect(wrapper.props().expanded).toHaveLength(0);

    expect(
      wrapper
        .find('tbody tr[hidden]:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(3) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(2);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(4) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();
  });

  it('single expand toggles correctly', async () => {
    const wrapper = createWrapper({
      props: {
        'cols': columns,
        'expanded': [],
        'modelValue': [],
        'onUpdate:expanded': (e: any) => wrapper.setProps({ expanded: e }),
        'rowAttr': 'id',
        'rows': data,
        'singleExpand': true,
      },
      slots: {
        'expanded-item': {
          template: '<div data-cy="expanded-content">Expanded content</div>',
        },
      },
    });

    expect(wrapper.props().expanded).toHaveLength(0);

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeTruthy();

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(0);

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();

    await wrapper
      .find('tbody tr:nth-child(1) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(
      wrapper
        .find('tbody tr:nth-child(2) div[data-cy=expanded-content]')
        .exists(),
    ).toBeTruthy();

    await wrapper
      .find('tbody tr:nth-child(3) button[class*=_tr__expander_button]')
      .trigger('click');

    expect(wrapper.props().expanded).toHaveLength(1);

    expect(
      wrapper
        .find('tbody tr:nth-child(1) button[class*=_tr__expander_button_open]')
        .exists(),
    ).toBeFalsy();

    expect(
      wrapper
        .find('tbody tr:nth-child(4) div[data-cy=expanded-content]')
        .exists(),
    ).toBeFalsy();
  });

  it('sticky header behaves as expected', async () => {
    const wrapper = createWrapper({
      props: {
        cols: columns,
        modelValue: [],
        rowAttr: 'id',
        rows: data,
        stickyHeader: true,
        stickyOffset: 40,
      },
    });

    expect(wrapper.find('thead[data-id=head-clone]').exists()).toBeTruthy();

    await wrapper.setProps({ stickyHeader: false });

    expect(wrapper.find('thead[data-id=head-clone]').exists()).toBeFalsy();
  });

  describe('global settings', () => {
    it('should follow global settings', async () => {
      const itemsPerPage = ref(25);
      const wrapperComponent = {
        template:
          '<div><DataTable :rows=\'[]\' row-attr=\'id\'/><DataTable :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            DataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              globalItemsPerPage: true,
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
            }),
          },
        },
      });

      await nextTick();

      const paginationInstances = wrapper.findAllComponents(TablePagination);
      expect(paginationInstances).toHaveLength(2);

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(
          expect.objectContaining({ limit: 25 }),
        );
      });

      const select = paginationInstances[0].findComponent(RuiSimpleSelect);
      select.vm.$emit('update:model-value', 10);

      await nextTick();

      paginationInstances.forEach((instance) => {
        expect(instance.vm.modelValue).toMatchObject(
          expect.objectContaining({ limit: 10 }),
        );
      });

      expect(get(itemsPerPage)).toBe(10);
    });

    it('should respect local setting override', async () => {
      const itemsPerPage = ref(25);
      const wrapperComponent = {
        template:
          '<div><DataTable :rows=\'[]\' row-attr=\'id\'/><DataTable :globalItemsPerPage=\'false\' :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            DataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              globalItemsPerPage: true,
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
            }),
          },
        },
      });

      await nextTick();

      const paginate = wrapper.findAllComponents(TablePagination);
      expect(paginate).toHaveLength(2);

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );
      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      const globalSelect = paginate[0].findComponent(RuiSimpleSelect);
      const localSelect = paginate[1].findComponent(RuiSimpleSelect);
      globalSelect.vm.$emit('update:model-value', 10);
      localSelect.vm.$emit('update:model-value', 25);

      await nextTick();

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

      expect(get(itemsPerPage)).toBe(10);
    });

    it('should follow single global setting', async () => {
      const itemsPerPage = ref(25);
      const wrapperComponent = {
        template:
          '<div><DataTable :rows=\'[]\' row-attr=\'id\'/><DataTable :globalItemsPerPage=\'true\' :rows=\'[]\' row-attr=\'id\'/></div>',
      };

      const wrapper = mount(wrapperComponent, {
        global: {
          components: {
            DataTable,
          },
          provide: {
            [TableSymbol.valueOf()]: createTableDefaults({
              itemsPerPage,
              limits: [5, 10, 15, 25, 50, 100, 200],
            }),
          },
        },
      });

      await nextTick();

      const paginate = wrapper.findAllComponents(TablePagination);
      expect(paginate).toHaveLength(2);

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

      const globalSelect = paginate[0].findComponent(RuiSimpleSelect);
      const localSelect = paginate[1].findComponent(RuiSimpleSelect);
      globalSelect.vm.$emit('update:model-value', 25);
      localSelect.vm.$emit('update:model-value', 10);

      await nextTick();

      expect(paginate[0].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 25 }),
      );

      expect(paginate[1].vm.modelValue).toMatchObject(
        expect.objectContaining({ limit: 10 }),
      );

      expect(get(itemsPerPage)).toBe(10);
    });
  });
});
